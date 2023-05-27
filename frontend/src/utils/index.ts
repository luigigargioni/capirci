export const downloadPdf = (pdf: string, name: string) => {
  const linkSource = `data:application/pdf;base64,${pdf}`
  const downloadLink = document.createElement('a')
  const fileName = name

  downloadLink.href = linkSource
  downloadLink.download = fileName
  downloadLink.click()
}
