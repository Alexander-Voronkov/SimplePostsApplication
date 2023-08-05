import {Client} from 'minio'
import fs from 'fs'

// Настройки подключения к MinIO
const minioClient = new Client({
    endPoint: 'minio.storage',
    port: 9000,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD
})

// Функция для загрузки изображения в хранилище MinIO
export async function uploadImageToMINIO(bucketName, imageName, imageBuffer, meta) 
    {
    // Проверка существования ведра (bucket), и создание, если оно не существует
    const bucketExists = await minioClient.bucketExists(bucketName)

    if (!bucketExists) {
        await minioClient.makeBucket(bucketName)
        console.log('Bucket создан:', bucketName)
    }

    // Загрузка изображения в хранилище MinIO
    minioClient.putObject(bucketName, imageName, imageBuffer, meta)

    console.log(`Изображение ${imageName} загружено в MinIO`)
    }

export async function downloadImageFromMINIO(bucketname, filename)
    {
        const bucketExists = await minioClient.bucketExists(bucketname)

        if (!bucketExists) {
            console.log('Такого bucket не существует.')
            return null
        }
        return new Promise((resolve, reject)=>
        {
            minioClient.statObject(bucketname, filename, (err, stat) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                    return;
                }

                minioClient.getObject(bucketname, filename, (err, data)=>
                {
                    const chunks = []
                    if(err)
                    {
                        console.log(err)
                        resolve(null)
                    }

                    data.on('error', err=>
                    {
                        console.log(err)
                        resolve(null)
                    })

                    data.on('data', chunk=>
                    {
                        chunks.push(chunk)
                    })

                    data.on('end', () => resolve({mime: stat.metaData['content-type'], data: Buffer.concat(chunks)}))
                })
            })
        })
    }