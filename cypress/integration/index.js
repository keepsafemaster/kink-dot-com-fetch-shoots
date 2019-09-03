describe('Get Videos', function () {
    it('Get Videos', function () {
        cy.visit('https://kink.com');
        cy.clearCookies();
        cy.reload();

        cy.get('div[id=ccc-close]', {timeout: 7000})
            .should('have.length', 1)
            .click();

        cy.wait(500);

        cy.get('button[value=straight]')
            .click({ force: true });

        cy.visit('https://www.kink.com/my/account');

        cy.readFile('login.info', 'utf8').then(function(logininfo) {
            login = logininfo.split('\n');

            cy.get('input[id=usernameLogin]')
                .type(login[0], { force: true })

            cy.get('input[id=passwordLogin]')
                .type(login[1], { force: true });
        });

        cy.wait(1000);

        cy.get('button[id=loginSubmit]')
            .click({ force: true });

        cy.readFile('links.csv', 'utf8').then(function(linkscsv) {
            const links = linkscsv.split('[,\n]');

            cy.wait(1000);

            links.forEach(function (link) {
                cy.visit(link);

                cy.get('a[quality=full]')
                    .first()
                    .should('have.attr', 'href')
                    .then((url) => {
                        const name = url.substring(
                            url.lastIndexOf("/"),
                            url.indexOf("?"),
                        );
                        cy.task('getVideo', { url, name }, { timeout: 3600000 });
                    });
            });
        });
    });
});