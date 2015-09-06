module.exports = (function () {

  //TODO: refactor this to not be static but holding a instanced
  // build object. expose fluid api to build a webworker?

  function WebWorkerBuilderClass () {
    //
  }

  WebWorkerBuilderClass.build = function (callback) {
    // Build a worker from an anonymous function body
    var blobURL = URL.createObjectURL (new Blob (
      [
        '(',
        callback.toString(),
        ')()'
      ],
      {
        type: 'application/javascript'
      }
    ));

    var worker = new Worker (blobURL);

    // Won't be needing this anymore
    URL.revokeObjectURL (blobURL);

    return worker;
  };

  return WebWorkerBuilderClass;

}) ();
