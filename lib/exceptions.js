class StandardException extends Error { }
class ImageDownloadException extends StandardException { }

module.exports = {
  StandardException,
  ImageDownloadException
}
