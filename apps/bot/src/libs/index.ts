import axios from "axios"
export async function uploadImageImgur({ image }: { image: string }) {
  const formData = new FormData()

  formData.append("image", image)
  formData.append("type", "url")


  console.log(`Client-ID ${process.env.CLIENT_ID}`)


  const res = await axios.post("https://api.imgur.com/3/image", formData, {
    headers: {
      "Authorization": `Client-ID ${process.env.CLIENT_ID}`,
    },
  })

  const imageRes = res.data

  return imageRes.data.link as string
}
