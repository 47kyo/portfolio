### 1. OVER VIEW

```ts
pick keys from a class or other interface

type ActiveStorageAttachmentCreateParams = Pick<
  ActiveStorageAttachment,
  'recordType' | 'name' | 'blobId' | 'checksum'
>
```

```ts
const allowedFormats {a , b}
type a = keyof typeof allowedFormats;
//can we use valueof
```

```ts
---> mvoe export interface ITermsAndConditionsUpdateParams

```

```ts

```

```ts

```

```ts

```

```ts

```

```ts
export type IFileExtention = "png" | "jpg" | "png";

export const mimeTypeMap: { [key in IFileExtention]: string } = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
};
```
