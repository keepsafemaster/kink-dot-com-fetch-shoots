Cypress.Screenshot.defaults({
    screenshotOnRunFailure: false,
});

describe('Fetch Shoots from Kink.com', function () {
    it('Get Videos', function () {
        cy.task('verify');

        cy.readFile('shoot.list', 'utf8').then(function(linkslist) {
            const links = linkslist.split('\n')
                .filter(link => link)
                .filter(link => link.trim().length > 0);
            const ongoingLinks = [...links];
            const completedLinks = [];


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

        cy.visit('https://www.kink.com/my/account');

        cy.readFile('login.info', 'utf8').then(function(logininfo) {
            const login = logininfo.split('\n')
                .filter(value => value)
                .map(value => value.trim())
                .filter(value => value.length > 0)

            cy.get('input[id=usernameLogin]')
                .type(login[0], { force: true })

            cy.get('input[id=passwordLogin]')
                .type(login[1], { force: true });
        });

        cy.wait(1000);

        cy.get('button[id=loginSubmit]')
            .click({ force: true });

            cy.wait(1000);

            links.forEach(function (link, index) {
                cy.visit(link);

                let description = '';
                cy.get('div[class=description')
                    .first()
                    .then(div => {
                        description = div.innerText;
                    });

                cy.get('a[class=zip-links]')
                    .each(value => {
                        for (let i = 0; i < value.length; i++) {
                            const url = value[i].href;
                            const name = url.substring(
                                url.lastIndexOf("/"),
                                url.indexOf("?"),
                            );

                            cy.task('getVideo', { url, name }, { timeout: 10800000 });
                        }
                    });

                cy.get('a[quality=full]')
                    .first()
                    .should('have.attr', 'href')
                    .then((url) => {
                        const name = url.substring(
                            url.lastIndexOf("/"),
                            url.indexOf("?"),
                        );
                        cy.task('getVideo', { url, name }, { timeout: 10800000 });

                        completedLinks.push(ongoingLinks[index]);
                        delete ongoingLinks[index];
                        cy.writeFile('shoot.list', ongoingLinks.join('\n'));

                        cy.writeFile('completed.list', completedLinks.join('\n'));
                    });
            });
        });
    });
});