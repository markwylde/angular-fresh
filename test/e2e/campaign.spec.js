describe("campaigns", function() {

    var newCampaignId;

    it("should have the correct window title", function() {

        browser.get('./#/campaign/create');
        expect(browser.getTitle()).toBe("Campaign Manager | Create a new campaign");

    });

    it("should POST a new campaign", function() {

        browser.findElement(protractor.By.model('campaign.name')).sendKeys('PTOR: Test Campaign Step 1');

        $('[ng-click="submit()"]').click();

        element.all(by.repeater('campaign in campaigns')).then(function(arr) {
            arr[0].evaluate('campaign.name').then(function(campaignName) {
                expect(campaignName).toBe('PTOR: Test Campaign Step 1');
            });
            arr[0].evaluate('campaign.id').then(function(campaignId) {
                newCampaignId = campaignId;
            });
        });

    });

    it("should GET and PUT the new campaign", function() {
        console.log("Editing: ./#/campaign/update/" + newCampaignId);

        browser.get('./#/campaign/update/' + newCampaignId);

        expect(browser.findElement(protractor.By.model('campaign.name')).getAttribute('value')).toBe('PTOR: Test Campaign Step 1');

        browser.findElement(protractor.By.model('campaign.name')).clear();
        browser.findElement(protractor.By.model('campaign.name')).sendKeys('PTOR: Test Campaign Step 2');

        $('[ng-click="submit()"]').click();

        element.all(by.repeater('campaign in campaigns')).then(function(arr) {
            arr[0].evaluate('campaign.name').then(function (campaignName) {
                expect(campaignName).toBe('PTOR: Test Campaign Step 2');
            });
        });
    });

    it("should DELETE the new campaign", function() {

        browser.get('./#/campaign/list');

        expect(browser.findElement(protractor.By.css('#deleteId' + newCampaignId)).isDisplayed()).toBeTruthy();
        browser.findElement(protractor.By.css('#deleteId' + newCampaignId)).click();

        $('[ng-click="deleteSelected()"]').click();

    });

});
