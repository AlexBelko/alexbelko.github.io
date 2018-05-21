document.addEventListener('DOMContentLoaded', () => {
    new Vue({
        el: "#app",
        data: {
            trackerCode: '',
            bannerCode: '',
        },
        created() {
            ['trackerCode', 'bannerCode'].forEach(data => {
                this[data] = localStorage.getItem(data);
            });
        },
        methods: {
            SaveAndReload () {
                ['trackerCode', 'bannerCode'].forEach(data => {
                    localStorage.setItem(data, this[data]);
                });

                const windowOptions = {
                    width: 600,
                    height: 600,
                    menubar: false,
                    toolbar: true,
                    status: true,
                };

                function convertWindowOptionsToString(optionsObj) {
                    return Object.entries(optionsObj).map(e => {
                        return `${ e[0] }=${ e[1] === true ? 'yes' : e[1] === false ? 'no' : e[1] }`;
                    }).join(',')
                }

                const newWin = window.open("about:blank", "cheker", convertWindowOptionsToString(windowOptions));



                function appendCodes(code, win) {
                    let scripts = code.trim().split('<script>');
                    scripts = scripts.map(script => script.split('</script>')[0]).join(';');

                    let links = [];
                    let myArray;
                    let re = /src=".+?"/g;

                    // From MDN example (RegExp/exec)
                    while ((myArray = re.exec(scripts)) !== null) {
                        links.push(myArray[0].slice(5, -1));
                    }

                    if (scripts) {
                        runScript.call(win, scripts);
                    }

                    if (links.length > 0) {
                        links.forEach((link) => {
                            let tag = win.document.createElement('script');
                            tag.setAttribute('src', link);
                            win.document.body.appendChild(tag);
                        });
                    }

                    function runScript(script) {
                        try {
                            eval(script);
                        } catch (error) {
                            console.warn('Error when try run user script', error);
                        }
                    }
                }

                function appendBanner(banner, win) {
                    let block = win.document.createElement('div');
                    block.innerHTML = banner;
                    win.document.body.appendChild(block);
                }

                newWin.onload = () => {
                    appendCodes(this.trackerCode, newWin);
                    appendBanner(this.bannerCode, newWin);
                }
            },
        }
      })
})
