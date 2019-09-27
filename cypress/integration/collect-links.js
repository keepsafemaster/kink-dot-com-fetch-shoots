Cypress.Screenshot.defaults({
    screenshotOnRunFailure: false,
});

describe('Fetch Shoots from Kink.com', function () {
    it('Get Videos', function () {
        cy.task('verify');

        cy.readFile('collect-links.list', 'utf8').then(function(linkslist) {
            const links = linkslist.split('\n')
                .filter(link => link)
                .filter(link => link.trim().length > 0);

            if (links < 1) {
                return;
            }

            cy.visit('https://kink.com');
            cy.clearCookies();
            cy.reload();

            cy.get('div[id=ccc-close]', {timeout: 7000})
                .should('have.length', 1)
                .click();

            cy.wait(500);

            cy.get('button[value=straight]')
                .click({ force: true });

            const output = [];

            links.forEach(function (link, index) {
                cy.visit(link);

                cy.get('a[class=shoot-link]')
                    .each(value => {
                        for (let i = 0; i < value.length; i++) {
                            const url = value[i].href;
                            output.push(url);
                            cy.writeFile('links.list', output.join('\n'));
                        }
                    });
            });
        });
    });
});