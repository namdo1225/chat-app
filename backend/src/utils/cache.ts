import redisClient from "./redis";

/**
 * Caches data within Redis
 * @param {string} key The Redis key.
 * @param {() => Promise<T>} fetcher The function to fetch the data.
 * @param {number} expiration The optional expiration
 * time of the data in seconds.
 * @returns {Promise<T | null>} The retrieved data.
 */
const cacheData = async <T>(
    key: string,
    fetcher: () => Promise<T>,
    expiration: number = 3600
): Promise<T | null> => {
    try {
        const cacheResults = await redisClient.get(key);
        if (cacheResults) {
            return JSON.parse(cacheResults) as T;
        } else {
            const results = await fetcher();
            if (results)
                await redisClient.set(key, JSON.stringify(results), {
                    EX: expiration,
                });

            return results;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

export { cacheData };
