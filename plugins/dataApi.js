export default function(context, inject) {

    const appId = process.env.ALGOLIA_APP_ID
    const apiKey = process.env.ALGOLIA_API_KEY
    const headers =  {
                    'X-Algolia-API-Key': apiKey,
                    'X-Algolia-Application-Id': appId,
                }

    inject('dataApi', {
        getHome,
        getReviewsByHomeId,
        getUserByHomeId,
        getHomesByLocation
    })

    async function getHome(homeId) {
        try {
            return unWrap( await fetch(`https://${appId}-dsn.algolia.net/1/indexes/homes/${homeId}`, { headers }) )
        }
        catch(err) {
            return getErrorResponse(err)
        }
    }

    async function getReviewsByHomeId(homeId) {
        try {
            return unWrap (await fetch(`https://${appId}-dsn.algolia.net/1/indexes/reviews/query`, {
                headers,
                method: 'POST',
                body: JSON.stringify({
                    filters: `homeId:${homeId}`,
                    hitsPerPage: 6,
                    attributesToHighlight: [],
                })
            }))
        } catch(err) {
            return getErrorResponse(err)
        }
    }

    async function getUserByHomeId(homeId) {
        try {
            return unWrap (await fetch(`https://${appId}-dsn.algolia.net/1/indexes/users/query`, {
                headers,
                method: 'POST',
                body: JSON.stringify({
                    filters: `homeId:${homeId}`,
                    attributesToHighlight: [],
                })
            }))
        } catch(err) {
            return getErrorResponse(err)
        }
    }

    async function getHomesByLocation(lat, lng, radiusInMeters = 1500) {
        try {
            return unWrap (await fetch(`https://${appId}-dsn.algolia.net/1/indexes/homes/query`, {
                headers,
                method: 'POST',
                body: JSON.stringify({
                    aroundLatLng : `${lat}, ${lng}`,
                    aroundRadius: radiusInMeters,
                    hitsPerPage: 10,
                    attributesToHighlight: [],
                })
            }))
        } catch(err) {
            return getErrorResponse(err)
        }
    }


    async function unWrap(response) {
        const json = await response.json();

        const {ok, status, statusText} = response

        return {
            json,
            ok,
            status,
            statusText
        }
    }

    function getErrorResponse(error) {
        return {
            ok: false,
            status: 500,
            statusText: error.message,
            json: {}
        }
    }
}