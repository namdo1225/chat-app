import redisClient from "./redis";

const cacheData = async <T>(
    key: string,
    fetcher: () => Promise<T>
): Promise<T | null> => {
    try {
        const cacheResults = await redisClient.get(key);
        if (cacheResults) {
            return JSON.parse(cacheResults) as T;
        } else {
            const results = await fetcher();
            if (results)
                await redisClient.set(key, JSON.stringify(results), {
                    EX: 3600,
                });

            return results;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

export { cacheData };
