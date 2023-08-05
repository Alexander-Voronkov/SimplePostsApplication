import redis from 'redis'
import {createClient} from "redis"
// import dotenv from 'dotenv'
// dotenv.config({path: '../.env'})

class RedisCacheJWT {
    constructor() {
        const redisHost = process.env.REDIS_CACHE_JWT_HOST || "redis.cache";
      
        this.client = createClient({ url: `redis://${redisHost}` });
        this.client.connect()

        this.client.on("connect", () => {
            console.log("Redis Jwt Cache connected")
        });

        // Обработка ошибок подключения к Redis
        this.client.on('error', (err) => {
            console.error('Ошибка подключения к Redis:', err);
        });
    }

    get(key) {
        return this.client.get(key)
    }

    set(key, value, expirationTimeInSeconds = 3600) {
        return this.client.setEx(key, expirationTimeInSeconds, value, (err) => {
            if (err) {
                console.error('Ошибка при сохранении значения в кеш:', err)
            }
        })
    }

    del(key) {
        return this.client.del(key, (err, count) => {
            if (err) {
                console.error('Ошибка при удалении значения из кеша:', err)
            } else {
                console.log(`Удалено ${count} значений с ключом ${key}`)
            }
        })
    }
}

const MyRedisCacheJWT = new RedisCacheJWT()

export default MyRedisCacheJWT