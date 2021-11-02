Чтобы не хранить много байт информации в токене, мы кодируем в нем ответы на некую "анкету", поля которой мы храним в коллекции в constOnChainSchema.

Будем называть анкету "ConstOnChainSchema";

ConstOnChainSchema хранит JSON с типом ProtobufAttributeType;

type ProtobufAttributeType = {
  nested: {
    onChainMetaData: {
      nested: {
        [key: string]: {
          fields?: {
            [key: string]: {
              id: number;
              rule: 'optional' | 'required' | 'repeated';
              type: string;
            }
          }
          options?: { [key: string]: string };
          values?: { [key: string]: number };
        }
      }
    }
  }
}

Далее мы работаем уже с этим форматом, как с protobuf:

const root = Root.fromJSON(ConstOnChainSchema);

ВАЖНО! Чтобы наш код правильно раскодировал ваш JSON фомат, нужно, чтобы в нем присутствовали поля onChainMetaData и onChainMetaData.NFTMeta с сохранением camelCase регистра.

const NFTMeta = root.lookupType('onChainMetaData.NFTMeta');

Ответы на эту анкету хранятся в токене в поле ConstData

Декодируем ответы, подставляя их в анкету

const message = NFTMeta.decode(ConstData);

const tokenAttributes = NFTMeta.toObject(message, {
      arrays: true, // populates empty arrays (repeated fields) even if defaults=false
      bytes: String, // bytes as base64 encoded strings
      defaults: true, // includes default values
      enums: String, // enums as string names
      longs: String, // longs as strings (requires long.js)
      objects: true, // populates empty objects (map fields) even if defaults=false
      oneofs: true
    });

tokenAttributes - это и есть раскодированные атрибуты токена.

К примеру, для челобрика #2821 мы получим такие аттрибуты - traits: Eyes Up, Black Earrings, Vampire, 3-day Stubble Orange, Unique Blue Logo

Еще один важный момент. В ConstData мы харним ключ к нужным опциям options из полей ConstOnChainSchema.
Это сделано для того, чтобы брать нужную нам локализацию по выбору, на примере локализации "en" коллекции "Челобрики" наш атрибут будет называться "Blah-blah Eyes"

Пример ConstOnChainSchema из коллекции Челобрики:

{
   "nested":{
      "onChainMetaData":{
         "nested":{
            "NFTMeta":{
               "fields":{
                  "traits":{
                     "id":1,
                     "rule":"repeated",
                     "type":"CheloTrait"
                  }
               }
            },
            "CheloTrait":{
               "options":{
                  "EYES_1":"{\"en\": \"Blah-blah Eyes\"}",
                  "EYES_2":"{\"en\": \"Eyes To The Left\"}",
                 ...
               },
               "values":{
                  "EYES_1":0,
                  "EYES_2":1,
                 ...
               }
            }
         }
      }
   }
}

Более подробный пример вы можете посмотреть в нашем воркшопе https://github.com/UniqueNetwork/nft-workshop/blob/master/protobuf.js
