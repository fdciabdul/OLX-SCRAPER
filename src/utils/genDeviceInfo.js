const { getState } = require("./getState");

async function generateDeviceInfo() {
    const data = await getState();
    const loginDetails = {
        cityName: data.city,
        state: data.state,
        location: {
            lat: data.latitude,
            long: data.longitude
        }
    };
    const encodedDeviceInfo = Buffer.from(JSON.stringify(loginDetails)).toString('base64');
    return encodedDeviceInfo;
}


module.exports = {
    generateDeviceInfo
}