max-width: fit-content;
or
display: inline-flex;

aspect-ratio explain youtube

```
.a {
  . b
 }

this work if b is child of a , but if we wanna apply both a and b on the same elemet
.a {]
.b {}

but iff we wanna target a child class of a inside b it wont be possible, that why we can use
.a{
 .x
 &.b {
    now we can modify x here
  }
}
```
