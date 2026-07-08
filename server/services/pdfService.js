import PDFParser from "pdf2json";

const decode = (text = "") => {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
};

const cleanText = (text = "") => {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const extractTextFromPDF = async (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(
        new Error(
          err?.parserError ||
            "Unable to parse PDF."
        )
      );
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        if (
          !pdfData.Pages ||
          pdfData.Pages.length === 0
        ) {
          return reject(
            new Error("No pages found.")
          );
        }

        let text = "";

        pdfData.Pages.forEach((page) => {
          page.Texts.forEach((item) => {
            item.R.forEach((run) => {
              text += decode(run.T) + " ";
            });

            text += "\n";
          });

          text += "\n\n";
        });

        text = cleanText(text);

        if (text.length < 20) {
          return reject(
            new Error(
              "No readable text found in PDF."
            )
          );
        }

        console.log(
          "\n========== EXTRACTED TEXT ==========\n"
        );
        console.log(text.substring(0, 3000));
        console.log(
          "\n====================================\n"
        );

        resolve(text);
      } catch (err) {
        reject(err);
      }
    });

    pdfParser.loadPDF(filePath);
  });
};