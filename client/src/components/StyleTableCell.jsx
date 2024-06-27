import { TableCell, styled, tableCellClasses } from "@mui/material";

const TableCellStyled = styled(TableCell)(({ theme }) => {
  return {
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15,
    },
  };
});

const StyleTableCell = ({ children }) => {
  return <TableCellStyled>{children}</TableCellStyled>;
};
export default StyleTableCell;
