"use strict"

const requestToContext = require('../lib/requestToContext');

describe('requestToContext', () => {
  describe('Converts the request to the correct context', () => {
    it('For get requests', () => {
      const result = requestToContext({
        method: 'GET',
        query: {
          paths: '[["genrelist",{"from":0,"to":5},"titles",{"from":0,"to":5},"name"]]',
          method: 'get'
        }
      });

      expect(result).toEqual({
        paths: [
          [
            'genrelist', {
              from: 0,
              to: 5
            },
            'titles', {
              from: 0,
              to: 5
            },
            'name'
          ]
        ],
        method: 'get'
      });
    });

    it('For post requests', () => {
      const result = requestToContext({
        method: 'POST',
        body: {
          jsonGraph: '{"jsonGraph":{"genrelist":{"0":{"titles":{"0":{"name":"jon"}}}},"paths":[["genrelist",0,"titles",0,"name"]]}}',
          method: 'set'
        }
      });

      expect(result).toEqual({
        jsonGraph: {
          jsonGraph: {
            "genrelist": {
              "0": {
                "titles": {
                  "0": {
                    "name": "jon"
                  }
                }
              }
            },
            "paths": [
              ["genrelist", 0, "titles", 0, "name"]
            ]
          }
        },
        method: 'set'
      });
    });
  });
});
