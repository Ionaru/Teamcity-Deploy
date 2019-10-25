import axios, { AxiosError } from 'axios';

export async function deploy(host: string, buildType: string, apiKey: string) {

    const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/xml',
        'Origin': '*',
    };

    const buildQueueResponse = await axios.post(
        `https://${host}/app/rest/buildQueue`,
        `<build><buildType id="${buildType}"></buildType></build>`,
        {headers},
    ).catch((e: AxiosError) => e);

    if (buildQueueResponse instanceof Error) {
        throw buildQueueResponse;
    }

    const buildId = buildQueueResponse.data.id;

    return new Promise((resolve, reject) => {

        setInterval(async () => {

            const response = await axios.get(
                `https://${host}/app/rest/builds/${buildId}`,
                {headers},
            ).catch((e: AxiosError) => e);

            if (response instanceof Error) {
                reject(response);
                return;
            }

            if (response.data.state === 'finished') {

                switch (response.data.status) {
                    case 'SUCCESS':
                        resolve();
                        return;
                    case 'FAILURE':
                    default:
                        reject(`Deploy failed: https://${host}/viewLog.html?buildId=${buildId}&buildTypeId=${buildType}&tab=buildLog`);
                        return;
                }
            }

        }, 5000);

    });
}
