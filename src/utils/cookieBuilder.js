module.exports = function cookieBuilder(user,accessToken,refreshToken,chatToken,notificationHubId){
    return `user=j%3A%7B%22id%22%3A%22${user.id}%22%2C%22name%22%3A%22${encodeURIComponent(user.name)}%22%7D;t=${accessToken};rt=${refreshToken};ct=${chatToken};nt=${notificationHubId};otherCookies=values`
}