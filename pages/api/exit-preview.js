export default function exitPreview(req, res) {
    res.setDraftMode({ enable: false });
    res.writeHead(307, { Location: '/' });
    res.end();
}
