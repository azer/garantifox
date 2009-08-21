var format_exception = function(exception){
  return [
    'EXCEPTION',
    'File: '+exception.fileName,
    'Line Number: '+ exception.lineNumber,
    'Message: '+ exception.message
  ].join('\n\n')
}