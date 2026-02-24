import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AvatarButton from "./AvatarButton";
import { pressable } from "@/lib/motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
}

export default function PageHeader({ title, subtitle, backTo }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-14 pb-3 px-5 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        {backTo && (
          <motion.button
            {...pressable}
            onClick={() => navigate(backTo)}
            className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full bg-secondary text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        )}
        <div>
          <h1 className="text-2xl font-display font-bold text-gradient-gold">{title}</h1>
          {subtitle && <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <AvatarButton />
    </motion.div>
  );
}
