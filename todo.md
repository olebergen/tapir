- fix gh auth error message

---

- fix error handling log

- fix dhr no pr found

- error management of gh in dhr frontend job script

- typescript lsp import mit ts statt ohne

---

- draws anlegen, ganz viele oder nur einer in zukunft? dann testhaus aus storyblok nehmen

```bash
 curl -k -i -u alinghi:changeMe -X 'POST' \
       https://lis2.app-ole-dhr.test.t24.eu-west-1.sg-cloud.co.uk/test/draws/traumhausverlosung \
       -H 'accept: */*' \
       -H 'Content-Type: application/json' \
       -d '{
         "drawDate": "2025-12-24T19:00:00.147Z",
           "drawName": {
             "name": "Testhaus",
             "technicalIdentifier": "TESTHAUS"
           }
       }'
```
