import { getState } from "./getState";
async function generateDeviceInfo() {
    const data:any = await getState();
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


export { generateDeviceInfo }