function debug(fn){
  try {
    fn.call(window);
  } catch(exception){
    log( format_exception(exception) );
  }
}