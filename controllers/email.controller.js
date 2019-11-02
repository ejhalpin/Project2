require("dotenv").config();
var sg = require("sendgrid")(process.env.SG_MAIL_KEY);

module.exports = {
  sendMessage: (req, res) => {
    var request = sg.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: {
        personalizations: [
          {
            to: [
              {
                email: req.body.email
              }
            ],
            subject: req.body.subject
          }
        ],
        from: {
          email: "no-reply@busy-bee.com"
        },
        content: [
          {
            type: "text/html",
            value: req.body.message
          }
        ]
      }
    });
    sg.API(request)
      .then(info => {
        res.json(info);
      })
      .catch(err => res.json(err));
  },
  contactUs: (req, res) => {
    var request = sg.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: {
        personalizations: [
          {
            to: [
              {
                email: "ejhalpin3@gmail.com"
              }
            ],
            subject: req.body.subject
          }
        ],
        from: {
          email: req.body.email
        },
        content: [
          {
            type: "text/html",
            value: req.body.message
          }
        ]
      }
    });
    sg.API(request)
      .then(info => {
        var relay = sg.emptyRequest({
          method: "POST",
          path: "v3/mail/send",
          body: {
            personalizations: [
              {
                to: [
                  {
                    email: req.body.email
                  }
                ],
                subject: "Thank you for contacting the Busy-Bee team!"
              }
            ],
            from: {
              email: "no-reply@busy-bee-home.herokuapp.com"
            },
            content: [
              {
                type: "text/html",
                value:
                  "We've received your message and will get back to you as soon as possible. Thanks for taking the time to contact us! \nCheers,\nThe Busy Bee Team"
              }
            ]
          }
        });
        sg.API(relay)
          .then(conf => {
            res.json({ info, conf });
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }
};
