const { OLXClient } = require("./src/main.class");

(async () => {
    const client = new OLXClient();
    try {

        const userData = await client.getCategory();
        console.log(userData);
    } catch (error) {
        console.error(error.message);
    }
})();