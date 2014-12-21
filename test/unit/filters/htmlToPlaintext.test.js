'use strict';

describe('Filters: exampleTest', function() {

    beforeEach(module('campaignManagerApp'));

    it('exampleTest: this is the first example test', inject(function($rootScope, $filter) {
        expect(1).toBe(1);
    }));

});