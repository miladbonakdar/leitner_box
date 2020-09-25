export default (dataPromise, done) => {
  dataPromise
    .then(res => {
      done(res)
    })
    .catch(err => {
      console.log(err)
      throw err
    })
}
