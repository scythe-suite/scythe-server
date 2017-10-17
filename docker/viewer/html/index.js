const DEBUG = true;

const STORE = {
    session: { // predeclared for mutation detection
        id: null,
        summaries: {},
        texts: {},
        cases: {},
        uids: [],
        exercises: []
    },
    details: { // predeclared for mutation detection
        uid: null,
        timestamp: null,
        exercise: null,
        solutions: {},
        compilation: null,
        results: {}
    }
};

const TheHome = Vue.component('the-home', {
    template: '#home-template'
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
          if (event.path.length < 2) return;
          let idx = event.path[2].cellIndex - 2;
          let exercise = this.session.exercises[idx];
          if (!exercise) return;
          window.location.hash = `#d/${item.uid}/${item.timestamp}/${exercise}`;
      },
      resultFormatter: function(value, key, item) {
          if (!STORE.session.cases[key]) return value;
          let tot = STORE.session.cases[key].length;
          if (!value) return '&nbsp;';
          if (!value.compile) return '<div class="progress"><div class="progress-bar" role="progressbar" style="width: 100%" ></div></div>';
          return `<div class="progress">
            <div class="progress-bar bg-danger" role="progressbar" style="width: ${(100*value.errors)/tot}%" >${value.errors}</div>
            <div class="progress-bar bg-warning" role="progressbar" style="width: ${(100*value.diffs)/tot}%" >${value.diffs}</div>
            <div class="progress-bar bg-success" role="progressbar" style="width: ${(100*value.oks)/tot}%">${value.oks}</div>
            </div>`;
      }
    },
    computed: {
        fields: function() {
            if (!this.session.id) return [];
            let fields = [{key: 'uid', sortable: true}, {key: 'info', sortable: true}];
            this.session.exercises.forEach(
                e => fields.push({key: e, sortable: true, formatter: 'resultFormatter'})
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

const TheDetail = Vue.component('the-detail', {
    template: "#detail-template",
    data: () => ({session: STORE.session, details: STORE.details}),
    computed: {
        hasIssues: function() {
            if (!this.details.uid || !this.details.results) return false;
            return (this.details.results.filter(r => r.diffs || r.errors)).length > 0;
        },
        issues: function() {
            if (!this.details.uid || !this.details.results) return [];
            return this.details.results.sort((a, b) => a.name.localeCompare(b.name)).filter(r => r.diffs || r.errors);
        },
        solutions: function() {
            if (!this.details.uid) return [];
            let original = this.details.solutions;
            return original.map(e => ({
                name: e.name,
                highlighted: hljs.highlightAuto(e.content).value
            }));
        },
        texts: function() {
            if (!this.details.uid) return [];
            let original = this.session.texts[this.details.exercise];
            return original.map(e => ({
                name: e.name,
                marked: marked(e.content, {sanitize: true})
            }));
        },
        caseNames: function() {
            if (!this.details.uid) return [];
            let original = this.session.cases[this.details.exercise];
            return original.map(e => e.name).sort();
        },
        cases: function() {
            if (!this.details.uid) return [];
            let original = this.session.cases[this.details.exercise];
            let cases = {};
            original.forEach(e => {cases[e.name] = e;});
            return cases;
        }
    }
});

function set_details(uid, timestamp, exercise) {
    if (uid == STORE.details.uid && timestamp == STORE.details.timestamp && exercise == STORE.details.exercise) return;
    axios.all([
        axios.get(`r/solutions/${uid}/${timestamp}/${exercise}`),
        axios.get(`r/results/${uid}/${timestamp}/${exercise}`),
        axios.get(`r/compilations/${uid}/${timestamp}/${exercise}`),
    ]).then(axios.spread(function(solutions, results, compilation) {
        Object.assign(STORE.details, {
            uid: uid,
            timestamp: timestamp,
            exercise: exercise,
            solutions: solutions.data.solutions,
            compilation: compilation.data.compilations,
            results: results.data.results
        });
        if (DEBUG) console.log(`Updated details to '${STORE.details.uid}@${STORE.details.timestamp}/${STORE.details.exercise}'`);
        if (DEBUG) console.log(STORE.details);
    }));
}

function set_session(session) {
    if (session == STORE.session.id) return;
    axios.all([
        axios.get(`r/uids/${session}`),
        axios.get(`r/summaries/${session}`),
        axios.get(`r/texts/${session}`),
        axios.get(`r/cases/${session}`)
    ]).then(axios.spread(function(uids, summaries, texts, cases) {
        Object.assign(STORE.session, {
            id: session,
            summaries: summaries.data.summaries,
            texts: texts.data.texts,
            cases: cases.data.cases,
            uids: uids.data.uids,
            exercises: Object.keys(cases.data.cases).sort()
        });
        if (DEBUG) console.log(`Updated session to '${STORE.session.id}'`);
        if (DEBUG) console.log(STORE.session);
    }));
}

function onHashchange() {
    let hash = window.location.hash.split('/');
    if (DEBUG) console.log(hash);
    if (hash[0] == '#s' && hash.length == 2) {
        set_session(hash[1]);
        app.currentView = 'the-summary';
    } else if (hash[0] == '#d' && STORE.session.id && hash.length == 4) {
        set_details(hash[1], hash[2], hash[3]);
        app.currentView = 'the-detail';
    } else {
        app.currentView = 'the-home';
    }
}

const app = new Vue({
  el: '#app',
  data: {currentView: 'the-summary'},
})

window.addEventListener('hashchange', onHashchange);
onHashchange();
