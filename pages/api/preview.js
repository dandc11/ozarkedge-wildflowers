export default function preview(req, res) {
    res.setPreviewData({  });
    // res.setDraftMode({ enable: true });
    res.writeHead(307, { Location: '/' });
    res.end('Preview mode enabled');
}
