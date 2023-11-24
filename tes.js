const { OLXClient } = require("./src/main.class");

(async () => {
    const client = new OLXClient('abdulmuttaqin456@gmail.com', 'mana123');
    try {
        const loginData = await client.searchLocation("Jakarta Selatan");

     
        
      //  const userData = await client.getUserData('100042848', cookie);
        console.log(loginData);
    } catch (error) {
        console.error(error.message);
    }
})();