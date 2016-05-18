## Slices "gotcha"
Ref: https://blog.golang.org/go-slices-usage-and-internals#TOC_6.

> re-slicing a slice doesn't make a copy of the underlying array. **The full array will be kept in memory until it is no longer referenced**. Occasionally this can cause the program to hold all the data in memory when only a small piece of it is needed. 

> For example, this `FindDigits` function loads a file into memory and searches it for the first group of consecutive numeric digits, returning them as a new slice.

> ```go
var digitRegexp = regexp.MustCompile("[0-9]+")

> func FindDigits(filename string) []byte {
    b, _ := ioutil.ReadFile(filename)
    return digitRegexp.Find(b)
}
```

> This code behaves as advertised, but the returned `[]byte` points into an array containing the entire file. **Since the slice references the original array, as long as the slice is kept around the garbage collector can't release the array**; the few useful bytes of the file keep the entire contents in memory.

> To fix this problem one can copy the interesting data to a new slice before returning it:

> ```go
func CopyDigits(filename string) []byte {
    b, _ := ioutil.ReadFile(filename)
    b = digitRegexp.Find(b)
    c := make([]byte, len(b))
    copy(c, b)
    return c
}
```

> A more concise version of this function could be constructed by using append. This is left as an exercise for the reader. 

So, here is the `append` version:
```go
func CopyDigits(filename string) []byte {
    b, _ := ioutil.ReadFile(filename)
    b = digitRegexp.Find(b)
    var c []byte
    return append(c, b...)
}
```
