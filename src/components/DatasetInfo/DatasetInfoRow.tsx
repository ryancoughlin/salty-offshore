interface DatasetInfoRowProps {
  label: string;
  value: string;
}

const DatasetInfoRow: React.FC<DatasetInfoRowProps> = ({ label, value }) => (
  <div className="flex justify-between items-baseline">
    <span className="text-neutral-600 font-mono text-xs truncate mr-4 uppercase">
      {label}
    </span>
    <span className="text-neutral-900 font-mono text-xs text-right uppercase">
      {value}
    </span>
  </div>
);

export default DatasetInfoRow; 