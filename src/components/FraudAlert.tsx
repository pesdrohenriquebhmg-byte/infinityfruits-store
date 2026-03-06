import { AlertTriangle } from 'lucide-react';

const FraudAlert = () => {
  return (
    <div className="bg-destructive/10 border-b border-destructive/20">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 text-center">
        <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
        <p className="text-xs md:text-sm font-bold text-destructive">
          ⚠️ CUIDADO COM IMITAÇÕES — ESSA É A ÚNICA LOJA OFICIAL
        </p>
      </div>
    </div>
  );
};

export default FraudAlert;
