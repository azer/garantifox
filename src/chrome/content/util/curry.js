function Curry(fn,scope,args){
  scope = scope||window;
  args = Array.prototype.slice.call(arguments,2);
  return function(){
    return fn.apply(scope,args.concat( Array.prototype.slice.call(arguments,0) ));
  }
}