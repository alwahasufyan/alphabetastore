import { useCallback, useState } from "react";

// MUI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import ButtonBase from "@mui/material/ButtonBase";
import TextField from "@mui/material/TextField";

// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
export default function Voucher() {
  const [hasVoucher, setHasVoucher] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [notice, setNotice] = useState("");
  const handleToggleVoucher = useCallback(() => {
    setHasVoucher(prev => !prev);
    if (hasVoucher) setVoucherCode("");
  }, [hasVoucher]);
  const handleVoucherChange = useCallback(e => {
    setVoucherCode(e.target.value);
  }, []);
  const handleApplyVoucher = useCallback(() => {
    if (!voucherCode.trim()) return;
    setNotice("التحقق من القسائم غير مفعّل حاليًا.");
  }, [voucherCode]);
  return <Box mb={3}>
      <ButtonBase disableRipple onClick={handleToggleVoucher} sx={{
      color: "primary.main",
      fontWeight: 500
    }}>
        لدي قسيمة خصم
      </ButtonBase>

      <Collapse in={hasVoucher}>
        <FlexBox mt={2} gap={2} maxWidth={400}>
          <TextField fullWidth name="voucher" value={voucherCode} onChange={handleVoucherChange} placeholder="أدخل رمز القسيمة" aria-label="Voucher code input" />

          <Button type="button" color="primary" variant="contained" onClick={handleApplyVoucher} disabled={!voucherCode.trim()}>
            تطبيق
          </Button>
        </FlexBox>

        {notice ? <Box mt={1.5} color="text.secondary" fontSize={13}>{notice}</Box> : null}
      </Collapse>
    </Box>;
}