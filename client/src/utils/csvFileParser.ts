export function parseCsvText(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let quoteClosed = false;

  function finishField() {
    row.push(field);
    field = "";
    quoteClosed = false;
  }

  function finishRow() {
    finishField();
    rows.push(row);
    row = [];
  }

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (inQuotes) {
      if (character === '"' && nextCharacter === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
        quoteClosed = true;
      } else if (character === "\r" && nextCharacter === "\n") {
        field += "\n";
        index += 1;
      } else {
        field += character;
      }

      continue;
    }

    if (character === '"') {
      if (field.length > 0 || quoteClosed) {
        throw new Error("The CSV contains an unexpected quotation mark.");
      }
      inQuotes = true;
    } else if (character === ",") {
      finishField();
    } else if (character === "\n") {
      finishRow();
    } else if (character === "\r") {
      if (nextCharacter === "\n") {
        index += 1;
      }
      finishRow();
    } else if (quoteClosed) {
      if (character !== " " && character !== "\t") {
        throw new Error("The CSV contains text after a closing quotation mark.");
      }
    } else {
      field += character;
    }
  }

  if (inQuotes) {
    throw new Error("The CSV contains an unclosed quotation mark.");
  }

  if (field.length > 0 || row.length > 0 || quoteClosed) {
    finishRow();
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim().length > 0));
}

export function rowsToObjects(
  rows: string[][],
  expectedHeaders: readonly string[],
  templateName: string,
) {
  const [headerRow, ...dataRows] = rows;

  if (!headerRow) {
    throw new Error("The CSV file is empty.");
  }

  const headers = headerRow.map((header, index) =>
    (index === 0 ? header.replace(/^\uFEFF/, "") : header).trim(),
  );
  const validHeaders =
    headers.length === expectedHeaders.length &&
    headers.every((header, index) => header === expectedHeaders[index]);

  if (!validHeaders) {
    throw new Error(`The CSV headers do not match the ${templateName} template.`);
  }

  return dataRows.map((cells, index) => {
    if (cells.length !== expectedHeaders.length) {
      throw new Error(
        `CSV row ${index + 2} must contain ${expectedHeaders.length} columns.`,
      );
    }

    return Object.fromEntries(
      expectedHeaders.map((header, headerIndex) => [
        header,
        cells[headerIndex] ?? "",
      ]),
    );
  });
}
