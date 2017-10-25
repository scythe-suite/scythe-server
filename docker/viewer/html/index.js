const DEBUG = true;

var ext = -1;

const STORE = {
    sessions: [],
    session: { // predeclared for mutation detection
        id: null, // a string
        auth: null, // a string
        summaries: {}, // map from uids to summary objects
        texts: {}, // map from exercise name to an array of text objects
        cases: {}, // map from exercise name to an array of case objects
        uids: [], // list of uids
        exercises: [], // list of exercise names
        casenum: {} // map from exercise name to the numer of its casess
    },
    details: { // predeclared for mutation detection
        uid: null, // a string
        timestamp: null, // a string
        exercise: null, // a string
        solutions: [], // an array of solution objects
        compilation: null, // a string
        results: [] // an array with an entry per case
    }
};

const app = new Vue({data: {currentView: 'the-summary'}});

Vue.component('icon', window.VueAwesome);

const TheHome = Vue.component('the-home', {
    template: '#home-template'
});

const TheNavbar = Vue.component('the-navbar', {
    template: '#navbar-template',
    data: () => ({
        store: STORE
    }),
    computed: {
        options: () => STORE.sessions.map(s => ({value: s, text: s})),
        selected: {
            get: function() {return this.store.session.id;},
            set: function(session) {if (session != this.store.session.id) set_summary(session);}
        },
        summary: () => app.currentView == 'the-summary',
        lock: function() {return this.store.session.auth ? 'unlock': 'lock';}
    },
    methods: {
        click: () => app.currentView = 'the-summary'
    }
});

const TheSummary = Vue.component('the-summary', {
    template: "#summary-template",
    data: () => ({session: STORE.session}),
    methods: {
      customSort: function(a, b, key) {
          if (key=='uid' || key =='info') return null; // resort to default sort
          a = a[key]; b = b[key];
          if (a === undefined) return 1;
          if (b === undefined) return -1;
          if (!a.compile) return 1;
          if (!b.compile) return -1;
          if (b.errors < a.errors) return 1;
          if (b.errors > a.errors) return -1;
          if (b.diffs < a.diffs) return 1;
          if (b.diffs > a.diffs) return -1;
          return 0;
      },
      click: function(item, index, event) {
          if (!this.session.auth) return;
          if (!(event.target && event.target.parentNode && event.target.parentNode.parentNode)) return;
          let cellIndex = event.target.parentNode.parentNode.cellIndex;
          let idx = cellIndex - 2;
          let exercise = this.session.exercises[idx];
          if (!exercise) return;
          set_details(item.uid, item.timestamp, exercise);
          app.currentView = 'the-details';
      },
      resultFormatter: function(value, key, item) {
          if (!STORE.session.casenum[key]) return value;
          let tot = STORE.session.casenum[key];
          if (!value) return '&nbsp;';
          if (!value.compile) return '<div class="progress"><div class="progress-bar" role="progressbar" style="width: 100%" ></div></div>';
          res = '';
          if (value.errors)
            res += `<div class="progress-bar bg-danger" role="progressbar" style="width: ${(100*value.errors)/tot}%" >${value.errors}</div>`;
          if (value.diffs)
            res += `<div class="progress-bar bg-warning" role="progressbar" style="width: ${(100*value.diffs)/tot}%" >${value.diffs}</div>`;
          if (value.oks)
            res += `<div class="progress-bar bg-success" role="progressbar" style="width: ${(100*value.oks)/tot}%">${value.oks}</div>`;
          return `<div class="progress">${res}</div>`;
      }
    },
    computed: {
        fields: function() {
            if (!this.session.id) return [];
            let fields = this.session.auth ?
                [{key: 'uid', sortable: true}, {key: 'info', sortable: true}]
              : [{key: 'uid', sortable: true}];
            this.session.exercises.forEach(
                e => fields.push({
                    key: e,
                    label: e.substr(3),
                    sortable: true,
                    formatter: 'resultFormatter'
                })
            );
            return fields;
        },
        items: function() {
            if (!this.session.id) return [];
            let summaries = this.session.summaries;
            let items = [];
            for (uid in summaries) {
                let entry = summaries[uid];
                let info = this.session.uids.find(e => e.uid == uid).info;
                items.push(Object.assign({
                    uid: uid,
                    info: info,
                    timestamp: entry.timestamp,
                }, entry.summary));
            }
            return items;
        }
    }
});

const TheDetail = Vue.component('the-details', {
    template: "#details-template",
    data: () => ({session: STORE.session, details: STORE.details}),
    computed: {
        solutions: function() {
            let original = this.details.solutions;
            return original.map(e => ({
                name: e.name,
                highlighted: hljs.highlightAuto(e.content).value
            }));
        },
        issues: function() {
            return this.details.results.filter(r => r.diffs || r.errors).sort((a, b) => a.name.localeCompare(b.name));
        },
        texts: function() {
            let original = this.session.texts[this.details.exercise];
            if (typeof original === 'undefined') return [];
            return original.map(e => ({
                name: e.name,
                marked: marked(e.content, {sanitize: true})
            }));
        },
        caseNames: function() {
            let original = this.session.cases[this.details.exercise];
            if (typeof original === 'undefined') return [];
            return original.map(e => e.name).sort();
        },
        cases: function() {
            let original = this.session.cases[this.details.exercise];
            let cases = {};
            original.forEach(e => {cases[e.name] = e;});
            return cases;
        }
    }
});

function set_details(uid, timestamp, exercise) {
    if (uid == STORE.details.uid && timestamp == STORE.details.timestamp && exercise == STORE.details.exercise) {
        app.currentView = 'the-details';
        return;
    }
    let qauth = STORE.session.auth ? `?auth=${STORE.session.auth}` : '';
    let session = STORE.session.id;
    axios.all([
        axios.get(`r/solutions/${session}/${uid}/${timestamp}/${exercise}${qauth}`).catch(()=>{}),
        axios.get(`r/results/${session}/${uid}/${timestamp}/${exercise}${qauth}`).catch(()=>{}),
        axios.get(`r/compilations/${session}/${uid}/${timestamp}/${exercise}${qauth}`).catch(()=>{})
    ]).catch(function(error) {
        if (DEBUG) console.log(error);
    }).then(axios.spread(function(solutions, results, compilation) {
        Object.assign(STORE.details, {
            uid: uid,
            timestamp: timestamp,
            exercise: exercise,
            solutions: solutions ? solutions.data.solutions : [],
            compilation: compilation ? compilation.data.compilations: '',
            results: results ? results.data.results: []
        });
        if (DEBUG) console.log(`Updated details to '${STORE.details.uid}@${STORE.details.timestamp}/${STORE.details.exercise}'`);
        if (DEBUG) console.log(STORE.details);
        app.currentView = 'the-details';
    }));
}

function set_summary(session, auth) {
    if (session == STORE.session.id && auth && auth == STORE.session.auth) {
        app.currentView = 'the-summary';
        return;
    }
    let qauth = auth ? `?auth=${auth}` : '';
    axios.all([
        axios.get(`r/sessions`),
        axios.get(`r/uids/${session}`),
        axios.get(`r/exercises/${session}`),
        axios.get(`r/summaries/${session}${qauth}`).catch(()=>{}),
        axios.get(`r/texts/${session}${qauth}`).catch(()=>{}),
        axios.get(`r/cases/${session}${qauth}`).catch(()=>{})
    ]).catch(function(error) {
        if (DEBUG) console.log(error);
    }).then(axios.spread(function(sessions, uids, exercises, summaries, texts, cases) {
        STORE.sessions = sessions.data.sessions;
        let exe2num = exercises.data.exercises;
        Object.assign(STORE.session, {
            id: session,
            auth: auth,
            uids: uids.data.uids,
            exercises: Object.keys(exe2num).sort(),
            casenum: exe2num,
            summaries: summaries ? summaries.data.summaries : {},
            texts: texts ? texts.data.texts : {},
            cases: cases ? cases.data.cases : {}
        });
        Object.assign(STORE.details, {
            uid: null,
            timestamp: null,
            exercise: null,
            solutions: [],
            compilation: null,
            results: []
        });
        if (DEBUG) console.log(`Updated session to '${STORE.session.id}'`);
        if (DEBUG) console.log(STORE.session);
        app.currentView = 'the-summary';
        window.location.hash = auth ? `#s/${session}/${auth}` : `#s/${session}`;
    }));
}

function set_sessions() {
    axios.get(`r/sessions`).then(function(sessions) {
        STORE.sessions = sessions.data.sessions;
        if (DEBUG) console.log(`Known sessions '${STORE.sessions}'`);
        app.currentView = 'the-home';
        app.$mount('#app');
    });
}

function onHashchange() {
    let hash = window.location.hash.split('/');
    if (DEBUG) console.log(hash);
    if (hash[0] == '#s' && (hash.length == 2 || hash.length == 3))
        set_summary(hash[1], hash[2]);
    else
        app.currentView = 'the-home';
}

window.addEventListener('hashchange', onHashchange);
set_sessions();
onHashchange();
