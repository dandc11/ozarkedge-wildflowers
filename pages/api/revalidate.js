export default async function preview(
  req,
  res,
) {
  await res.revalidate('/')
  await new Promise((resolve) => setTimeout(resolve, 2000))
  res.writeHead(307, { Location: '/' })
  res.end()
}