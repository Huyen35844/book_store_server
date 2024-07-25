import formidable from "formidable";

const fileParer = async (req, res, next) => {
    const form = formidable()

    const [fields, files] = await form.parse(req)
    if (!req.body) req.body = {}

    //Data example fields
    // {
    //   "username": [
    //     "john_doe"
    //   ]
    // }

    for (let key in fields) {
        req.body[key] = fields[key][0]
    }

    if (!req.files) req.files = {}

    //Data example files
    // {
    //   "avatar": [
    //     {
    //       "name": "avatar1.jpg",
    //       "type": "image/jpeg",
    //       "size": 1024
    //     },
    //     {
    //       "name": "avatar2.png",
    //       "type": "image/png",
    //       "size": 2048
    //     }
    //   ]

    for (let key in files) {
        const actualFiles = files[key];
        //if there is no file
        if (!actualFiles) break;

        //if we upload more than 1 file
        if (actualFiles.length > 1) {
            req.files[key] = actualFiles
        }
        //if we upload only 1 file
        else {
            req.files[key] = actualFiles[0]
        }
    }
    next()
}

export default fileParer
