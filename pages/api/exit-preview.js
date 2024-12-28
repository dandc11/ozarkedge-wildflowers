
export default function exit(req, res) {
    res.setDraftMode({ enable: false })
    res.writeHead(307, { Location: '/' })
    res.end('Preview mode disabled')
}