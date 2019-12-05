using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Netsuite_Record_Uploader
{
    public class CsvRow : List<string>
    {
        public string LineText { get; set; }
    }
}
