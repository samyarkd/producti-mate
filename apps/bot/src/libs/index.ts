export async function uploadImageImgur({ image }: { image: string }) {
  const formData = new FormData()

  formData.append("image", image)
  formData.append("type", "url")


  const res = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      "Authentication": `Client-ID ${process.env.CLIENT_ID}`,
    },
    body: formData
  })

  const imageRes = await res.json()

  return imageRes.data.link as string
}
