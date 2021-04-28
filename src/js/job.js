import Vue from 'vue';

function initialFilters() {
    return {
        'role': [],
        'level': [],
        'languages': [],
    };
}

new Vue({
    el: '#app',
    data: function () {
        return {
            jobs: [],
            showFilters: false,
            filters: initialFilters()
        }
    },
    watch: {
        filters: {
            handler: 'hasFilters',
            deep: true
        },
    },
    methods: {
        getJobs: function () {
            let jobs = this.jobs;
            [].forEach.call(Object.keys(this.filters), filterName => {
                jobs = this.filters[filterName].length === 0 ? jobs : jobs.filter(job => {
                    let jobFilters = Array.isArray(job[filterName]) ? job[filterName] : [job[filterName]];
                    let filteredJob = 0;
                    for (let jobFilter of jobFilters) {
                        if (this.filters[filterName].indexOf(jobFilter) > -1) {
                            filteredJob++;
                        }
                    }
                    if (filteredJob > 0) {
                        return job;
                    }
                });
            });
            return jobs;
        },
        addFilter: function (type, value) {
            if (this.filters[type].indexOf(value) < 0) {
                this.$nextTick(() => {
                    this.filters[type].push(value);
                });
            }
        },
        clearFilter: function (type, value) {
            let filterIndex = this.filters[type].indexOf(value);
            if (filterIndex > -1) {
                this.filters[type].splice(filterIndex, 1);
            }
        },
        hasFilters: function () {
            let filters = [];
            for (let filterType in this.filters) {
                for (let filter of this.filters[filterType]) {
                    filters.push(filter);
                }
            }
            this.$nextTick(_ => {
                this.showFilters = filters.length > 0;
            });
        },
        isFilterActive: function (type, value) {
            return this.filters[type].indexOf(value) > -1;
        },
        clearAllFilters: function () {
            Object.assign(this.filters, initialFilters());
        }
    },
    created: function () {
        fetch('./data.json')
            .then(response => response.json())
            .then(data => {
                this.jobs = data;
            });
    }
});