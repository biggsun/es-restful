let should = require('should');
let Parser = require('../../dist/parser').Parser;
let http = require('http');
let qs = require('querystring');


describe('parser 错误参数检测测试', function () {
    describe('required test', function () {
        let server;

        before(() => {
            server = http.createServer((req, res) => {
                let parser = new Parser();
                parser.addParam('name', {
                    required: true
                });

                parser.parse(req, res).on('end', (data) => {
                    res.writeHead(200, {
                        'Content-type': 'application/json'
                    });
                    res.end(JSON.stringify(data));
                })
            }).listen(5052);
        })

        after(() => {
            server.close();
        })


        it('should return required error', (done) => {
            http.get({
                port: 5052
            }, (res) => {
                var data = [];
                res.on('data', chunk => {
                    data.push(chunk);
                }).on('end', () => {
                    data = JSON.parse(data.toString());
                    data.should.containEql({
                        error: [{
                            type: 2,
                            info: 'name'
                        }]
                    })
                    done();
                })
            }).end();
        })

        it('should return required success', (done) => {
            http.get({
                port: 5052,
                path: '/?name=lleohao'
            }, (res) => {
                var data = [];
                res.on('data', chunk => {
                    data.push(chunk);
                }).on('end', () => {
                    data = JSON.parse(data.toString());
                    data.should.containEql({
                        data: {
                            name: 'lleohao'
                        }
                    })
                    done();
                })
            }).end();
        })
    })

    describe('nullabled test', function () {
        let server;

        before(() => {
            server = http.createServer((req, res) => {
                let parser = new Parser();
                parser.addParam('name', {
                    nullabled: false
                });

                parser.parse(req, res).on('end', (data) => {
                    res.writeHead(200, {
                        'Content-type': 'application/json'
                    });
                    res.end(JSON.stringify(data));
                })
            }).listen(5052);
        })

        after(() => {
            server.close();
        })


        it('should return nullabled error', (done) => {
            http.get({
                port: 5052,
                path: '/?name='
            }, (res) => {
                var data = [];
                res.on('data', chunk => {
                    data.push(chunk);
                }).on('end', () => {
                    data = JSON.parse(data.toString());
                    data.should.containEql({
                        error: [{
                            type: 5,
                            info: 'name'
                        }]
                    })
                    done();
                })
            }).end();
        })
    })

    describe('type(int) test', function () {
        let server;

        before(() => {
            server = http.createServer((req, res) => {
                let parser = new Parser();
                parser.addParam('age', {
                    type: 'int'
                });
                parser.parse(req, res).on('end', (data) => {
                    res.writeHead(200, {
                        'Content-type': 'application/json'
                    });
                    res.end(JSON.stringify(data));
                })
            }).listen(5052);
        })

        after(() => {
            server.close();
        })


        it('should return type error', (done) => {
            http.get({
                port: 5052,
                path: '/?age=lleohao'
            }, (res) => {
                let data = [];
                res.on('data', chunk => {
                    data.push(chunk);
                }).on('end', () => {
                    data = JSON.parse(data.toString());
                    data.should.containEql({
                        error: [{
                            type: 3,
                            info: {
                                key: 'age',
                                type: 'number',
                                help: null
                            }
                        }]
                    })
                    done();
                })
            }).end();
        })

        it('should return type ok', (done) => {
            http.get({
                port: 5052,
                path: '/?age=21'
            }, (res) => {
                let data = [];
                res.on('data', chunk => {
                    data.push(chunk);
                }).on('end', () => {
                    data = JSON.parse(data.toString());
                    data.should.containEql({
                        data: {
                            age: 21
                        }
                    })
                    done();
                })
            }).end();
        })
    })

    describe('type(float) test', function () {
        let server;

        before(() => {
            server = http.createServer((req, res) => {
                let parser = new Parser();
                parser.addParam('weight', {
                    type: 'float'
                });
                parser.parse(req, res).on('end', (data) => {
                    res.writeHead(200, {
                        'Content-type': 'application/json'
                    });
                    res.end(JSON.stringify(data));
                })
            }).listen(5052);
        })

        after(() => {
            server.close();
        })


        it('should return type error', (done) => {
            http.get({
                port: 5052,
                path: '/?weight=lleohao'
            }, (res) => {
                let data = [];
                res.on('data', chunk => {
                    data.push(chunk);
                }).on('end', () => {
                    data = JSON.parse(data.toString());
                    data.should.containEql({
                        error: [{
                            type: 3,
                            info: {
                                key: 'weight',
                                type: 'number',
                                help: null
                            }
                        }]
                    });
                    done();
                })
            }).end();
        })

        it('should return type ok', (done) => {
            http.get({
                port: 5052,
                path: '/?weight=42.5'
            }, (res) => {
                let data = [];
                res.on('data', chunk => {
                    data.push(chunk);
                }).on('end', () => {
                    data = JSON.parse(data.toString());
                    data.should.containEql({
                        data: {
                            weight: 42.5
                        }
                    })
                    done();
                })
            }).end();
        })
    })

    describe('type(lambda) test', function () {
        let server;

        before(() => {
            server = http.createServer((req, res) => {
                let parser = new Parser();
                parser.addParam('join', {
                    type: (value) => {
                        return value.join('-')
                    },
                    help: 'haha'
                });
                parser.parse(req, res).on('end', (data) => {
                    res.writeHead(200, {
                        'Content-type': 'application/json'
                    });
                    res.end(JSON.stringify(data));
                })
            }).listen(5052);
        })

        after(() => {
            server.close();
        })

        it('should return type error', (done) => {
            let data = JSON.stringify({
                join: 'lleohao'
            })

            let req = http.request({
                port: 5052,
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                }
            }, (res) => {
                let data = [];
                res.on('data', chunk => {
                    data.push(chunk);
                }).on('end', () => {
                    data = JSON.parse(data.toString());
                    data.should.containEql({
                        error: [{
                            type: 3,
                            info: {
                                key: 'join',
                                type: 'function',
                                help: 'haha'
                            }
                        }]
                    });
                    done();
                })
            });
            req.write(data);
            req.end();
        })

        it('should return type error', (done) => {
            let data = JSON.stringify({
                join: ['lleo', 'hao']
            })

            let req = http.request({
                port: 5052,
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                }
            }, (res) => {
                let data = [];
                res.on('data', chunk => {
                    data.push(chunk);
                }).on('end', () => {
                    data = JSON.parse(data.toString());
                    data.should.containEql({
                        data: {
                            join: 'lleo-hao'
                        }
                    });
                    done();
                })
            });
            req.write(data);
            req.end();
        })
    })
});