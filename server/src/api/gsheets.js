import GoogleSpreadsheet from 'google-spreadsheet';

export default class Sheets {
    constructor(sheetId, clientEmail, privKey) {
        this.doc = new GoogleSpreadsheet(sheetId);
        this.creds = {
            client_email: clientEmail,
            private_key: privKey
        }
        this.authenticated = false;
        this.sheet = null;
    }

    async auth() {
        try {
            await this._authenticate();
        } catch (err) {
            throw new Error(err);
        }
    }

    async getSheet() {
        try {

            //authenticate if not authenticated
            if (!this.authenticated) {
                await this.auth();
            }

            //get spreadsheet info
            let info = await this._getSheetsInfo();
            let { worksheets } = info;
            //get our sheet from spreadsheet
            let sheets = await Promise.all(worksheets.map(sheet => {
                console.log("Sheet Title - " + sheet.title)
                if (sheet.title === process.env.SHEET_TITLE) {
                    console.log("it matches");
                    this.sheet = sheet;
                    return sheet;
                }
            }))

            return sheets[0]

        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }


    async getOappWithId(id) {
        return new Promise(async (resolve, reject) => {
            try {

                let sheet = await this.getSheet()
                //get rows from sheet
                let rows = await this._getRowsFromSheet(sheet);

                //find the entry that we need
                let row = rows.find((_row) => {
                    return (_row.oappid === id);
                });

                if (row) {
                    resolve(row)
                } else {
                    resolve(404)
                }

            } catch (error) {
                console.error("Error -" + error);
                resolve(500);
            }
        })
    }

    async getAllOapps() {
        let sheet = await this.getSheet()
        let rows = await this._getRowsFromSheet(sheet)
        return rows
    }

    async addOapp(data) {

        let row = {
            oappid: data.id,
            name: data.name,
            description: data.description,
            logourl: data.logourl,
            homepage: data.homepage,
            sourceurl: data.sourceurl,
            email: data.email,
            category: data.category,
            status: data.status
        }

        let sheet = await this.getSheet()

        let rowsBefore = await this._getRowsFromSheet(sheet)

        let added = await new Promise((res, rej) => {
            sheet.addRow(row, function (err, data) {
                if (err)
                    res(false)
                console.log('added');
                res(true);
            })
        })

        let rowsAfter = await this._getRowsFromSheet(sheet)

        if (added && rowsAfter.length == rowsBefore.length + 1)
            return 200

        return 500

    }

    async updateOappStatus(oappId, status, reason = "") {
        let sheet = await this.getSheet()
        let rows = await this._getRowsFromSheet(sheet)

        //find the entry that we need
        let row = rows.find((_row) => {
            return (_row.oappid === oappId);
        });

        if (!row) {
            return 404
        }

        //edit the status
        row.status = status
        //update rejection reason, if any
        if (reason != "")
            row.rejectionreason = reason
        //save the row
        let res = await new Promise((resolve, reject) => {
            //save row in gsheet
            row.save((err, done) => {
                if (!err) {
                    console.log(`Oapp [${row.name}] status updated to [${row.status}]`)
                    resolve(200)
                } else {
                    console.error(`Some error occured while updating Oapp [${row.name}] status to [${row.status}]`)
                    console.error(err)
                    resolve(500)
                }
            })
        })

        return res
    }

    async updateOappLikes(oappId, likes) {
        let sheet = await this.getSheet()
        let rows = await this._getRowsFromSheet(sheet)

        //find the entry that we need
        let row = rows.find((_row) => {
            return (_row.oappid === oappId);
        });

        if (!row) {
            return 404
        }

        //update the likes
        row.likes = likes

        //save the row
        let res = await new Promise((resolve, reject) => {
            //save row in gsheet
            row.save((err, done) => {
                if (!err) {
                    console.log(`Oapp [${row.name}] likes updated to [${row.likes}]`)
                    resolve(200)
                } else {
                    console.error(`Some error occured while updating Oapp [${row.name}] likes to [${row.likes}]`)
                    console.error(err)
                    resolve(500)
                }
            })
        })

        return res
    }

    //get the sheets info from spreadsheets
    _getSheetsInfo() {
        return new Promise((resolve, reject) => {
            this.doc.getInfo((err, info) => {
                if (!err) {
                    console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);
                    resolve(info);
                }
                else {
                    reject(err);
                }
            });
        })
    }

    _authenticate() {
        return new Promise((resolve, reject) => {
            this.doc.useServiceAccountAuth(this.creds, (err, done) => {
                if (!err) {
                    resolve(done);
                }
                else {
                    reject(err);
                }
            });
        })
    }

    _getRowsFromSheet(sheet) {
        return new Promise((resolve, reject) => {
            sheet.getRows({ offset: 1 }, (err, rows) => {
                if (!err) {
                    resolve(rows);
                }
                else {
                    reject(err);
                }
            })
        })
    }

}