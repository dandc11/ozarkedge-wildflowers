// Enable Preview Mode
// Path: pages/api/preview.js
export default function preview(req, res) {
  console.log('preview request ', req);
  console.log('preview response ', res);
  res.setDraftMode({ enable: true })
  res.writeHead(307, { Location: '/' })
  res.end('Preview mode enabled')
}