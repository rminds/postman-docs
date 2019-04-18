const fs = require('fs');
const cllectionPath = './collection.json';

let collection;

if (fs.existsSync(cllectionPath)) {
    collection = JSON.parse(fs.readFileSync(cllectionPath).toString());
} else {
    collection = false;
}

module.exports = {
    // browsersync configs
    server: {
        enabled: true,
        // choose, which platform should be served
        // you can serve few platforms at the same time, 
        // but make sure each of them use unique port number
        platform: ["docs"],
        // browsersync reloads browser when watched files are modified,
        // here you can choose which platform besides "served" will make 
        // browsersync to reload. 
        // Sometimes "served" platform rely on foreign platform
        watch_platforms: "all"
    },
    platforms: {
        // choose which platforms will be enabled, otherwise completely ignored
        enabled: [
            "docs"
        ]
    },
    // pass data to pug templates
    platforms_data: {
        docs: {
            collection: collection
        }
    }
};