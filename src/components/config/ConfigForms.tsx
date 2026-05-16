import React from 'react';
import { FormField, Input, Select } from '../ui/Form';

export default function ConfigForms({ section, formData, setFormData, errors, setErrors, data }: any) {
  switch (section) {
    case 'cards':
      return (
        <>
          <FormField label="Nombre" error={errors.name}>
            <Input 
              value={formData.name || ''} 
              onChange={e => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }} 
              placeholder="Ej. Bancolombia Principal"
              error={errors.name}
            />
          </FormField>
          <FormField label="Método de Pago" error={errors.paymentMethod}>
            <Select
              value={formData.paymentMethod || ''}
              onChange={e => {
                setFormData({ ...formData, paymentMethod: e.target.value });
                if (errors.paymentMethod) setErrors({ ...errors, paymentMethod: '' });
              }}
              options={[
                { value: '', label: 'Seleccione un método de pago' },
                { value: 'Llaves', label: 'Llaves' },
                { value: 'Tarjeta de Bancolombia', label: 'Tarjeta de Bancolombia' },
                { value: 'Tarjeta Davivienda', label: 'Tarjeta Davivienda' },
                { value: 'Tarjeta de Crédito', label: 'Tarjeta de Crédito' },
                { value: 'Tarjeta de Débito', label: 'Tarjeta de Débito' },
                { value: 'Transferencia', label: 'Transferencia' }
              ]}
              error={errors.paymentMethod}
            />
          </FormField>
          <FormField label="Últimos 4 Dígitos" error={errors.lastFourDigits}>
            <Input 
              value={formData.lastFourDigits || ''} 
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setFormData({ ...formData, lastFourDigits: val });
                if (errors.lastFourDigits) setErrors({ ...errors, lastFourDigits: '' });
              }} 
              placeholder="Ej. 4321"
              maxLength={4}
              error={errors.lastFourDigits}
            />
          </FormField>
          <FormField label="Estado" error={errors.status}>
            <Select
              value={formData.status || ''}
              onChange={e => {
                setFormData({ ...formData, status: e.target.value });
                if (errors.status) setErrors({ ...errors, status: '' });
              }}
              options={[
                { value: '', label: 'Seleccione un estado' },
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' }
              ]}
              error={errors.status}
            />
          </FormField>
          <FormField label="Descripción" error={errors.description}>
            <Input 
              value={formData.description || ''} 
              onChange={e => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }} 
              placeholder="Ej. Tarjeta corporativa para compras principales..."
              error={errors.description}
            />
          </FormField>
        </>
      );
    case 'paymentMethods':
      return (
        <FormField label="Nombre" error={errors.name}>
          <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} error={errors.name} />
        </FormField>
      );
    case 'documentTypes':
      return (
        <FormField label="Nombre" error={errors.name}>
          <Input value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} error={errors.name} />
        </FormField>
      );
    case 'airlines':
      return (
        <>
          <FormField label="Nombre" error={errors.name}>
            <Input 
              value={formData.name || ''} 
              onChange={e => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }} 
              placeholder="Ej. Avianca"
              error={errors.name}
            />
          </FormField>
          <FormField label="Código IATA" error={errors.code}>
            <Input 
              value={formData.code || ''} 
              onChange={e => {
                setFormData({ ...formData, code: e.target.value.toUpperCase().slice(0, 3) });
                if (errors.code) setErrors({ ...errors, code: '' });
              }} 
              placeholder="Ej. AV"
              maxLength={3}
              error={errors.code}
            />
          </FormField>
          <FormField label="Cobertura" error={errors.type}>
            <Select
              value={formData.type || ''}
              onChange={e => {
                setFormData({ ...formData, type: e.target.value });
                if (errors.type) setErrors({ ...errors, type: '' });
              }}
              options={[
                { value: '', label: 'Seleccione una cobertura' },
                { value: 'Nacional', label: 'Nacional' },
                { value: 'Internacional', label: 'Internacional' }
              ]}
              error={errors.type}
            />
          </FormField>
          <FormField label="Enlace del Sitio Web (Link)" error={errors.website}>
            <Input 
              value={formData.website || ''} 
              onChange={e => {
                setFormData({ ...formData, website: e.target.value });
                if (errors.website) setErrors({ ...errors, website: '' });
              }} 
              placeholder="Ej. https://www.avianca.com"
              error={errors.website}
            />
          </FormField>
        </>
      );
    case 'suppliers':
      return (
        <>
          <FormField label="Nombre" error={errors.name}>
            <Input 
              value={formData.name || ''} 
              onChange={e => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }} 
              placeholder="Ej. Hotel Dann Carlton"
              error={errors.name} 
            />
          </FormField>
          <FormField label="Tipo" error={errors.type}>
            <Select
              value={formData.type || ''}
              onChange={e => {
                setFormData({ ...formData, type: e.target.value });
                if (errors.type) setErrors({ ...errors, type: '' });
              }}
              options={[
                { value: '', label: 'Seleccione un tipo' },
                { value: 'Hotel', label: 'Hotel' }, 
                { value: 'Operador', label: 'Operador' }, 
                { value: 'Aerolinea', label: 'Aerolínea' }
              ]}
              error={errors.type}
            />
          </FormField>
          <FormField label="Contacto (Email)" error={errors.contact}>
            <Input 
              value={formData.contact || ''} 
              onChange={e => {
                setFormData({ ...formData, contact: e.target.value });
                if (errors.contact) setErrors({ ...errors, contact: '' });
              }} 
              placeholder="Ej. reservas@danncarlton.com"
              error={errors.contact} 
            />
          </FormField>
          <FormField label="Enlace del Sitio Web (Link)" error={errors.website}>
            <Input 
              value={formData.website || ''} 
              onChange={e => {
                setFormData({ ...formData, website: e.target.value });
                if (errors.website) setErrors({ ...errors, website: '' });
              }} 
              placeholder="Ej. https://www.danncarlton.com"
              error={errors.website} 
            />
          </FormField>
        </>
      );
    case 'airports':
      return (
        <>
          <FormField label="Nombre del Aeropuerto" error={errors.name}>
            <Input 
              value={formData.name || ''} 
              onChange={e => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }} 
              placeholder="Ej. Aeropuerto Internacional El Dorado"
              error={errors.name}
            />
          </FormField>
          <FormField label="Ubicación (Ciudad, País)" error={errors.location}>
            <Input 
              value={formData.location || ''} 
              onChange={e => {
                setFormData({ ...formData, location: e.target.value });
                if (errors.location) setErrors({ ...errors, location: '' });
              }} 
              placeholder="Ej. Bogotá, Colombia"
              error={errors.location}
            />
          </FormField>
          <FormField label="Abreviación IATA" error={errors.abbreviation}>
            <Input 
              value={formData.abbreviation || ''} 
              onChange={e => {
                setFormData({ ...formData, abbreviation: e.target.value.toUpperCase().slice(0, 3) });
                if (errors.abbreviation) setErrors({ ...errors, abbreviation: '' });
              }} 
              placeholder="Ej. BOG"
              maxLength={3}
              error={errors.abbreviation}
            />
          </FormField>
          <FormField label="Cobertura / Tipo" error={errors.type}>
            <Select
              value={formData.type || ''}
              onChange={e => {
                setFormData({ ...formData, type: e.target.value });
                if (errors.type) setErrors({ ...errors, type: '' });
              }}
              options={[
                { value: '', label: 'Seleccione tipo de cobertura' },
                { value: 'Nacional', label: 'Nacional' },
                { value: 'Internacional', label: 'Internacional' },
                { value: 'Ambos', label: 'Ambos (Nacional e Internacional)' }
              ]}
              error={errors.type}
            />
          </FormField>
          <FormField label="Estado" error={errors.status}>
            <Select
              value={formData.status || ''}
              onChange={e => {
                setFormData({ ...formData, status: e.target.value });
                if (errors.status) setErrors({ ...errors, status: '' });
              }}
              options={[
                { value: '', label: 'Seleccione estado' },
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' }
              ]}
              error={errors.status}
            />
          </FormField>
        </>
      );
    case 'baggage':
      return (
        <>
          <FormField label="Aerolínea" error={errors.airlineName}>
            <Select
              value={formData.airlineName || ''}
              onChange={e => {
                setFormData({ ...formData, airlineName: e.target.value });
                if (errors.airlineName) setErrors({ ...errors, airlineName: '' });
              }}
              options={[
                { value: '', label: 'Seleccione aerolínea' },
                ...data.config.airlines.map((a: any) => ({ value: a.name, label: a.name }))
              ]}
              error={errors.airlineName}
            />
          </FormField>
          <FormField label="Tipo de Tarifa / Cabina" error={errors.fareType}>
            <Input 
              value={formData.fareType || ''} 
              onChange={e => {
                setFormData({ ...formData, fareType: e.target.value });
                if (errors.fareType) setErrors({ ...errors, fareType: '' });
              }} 
              placeholder="Ej. Classic (M) o Light (S)"
              error={errors.fareType} 
            />
          </FormField>
          <FormField label="Artículo Personal (Morral/Bolso)" error={errors.personalItem}>
            <Input 
              value={formData.personalItem || ''} 
              onChange={e => {
                setFormData({ ...formData, personalItem: e.target.value });
                if (errors.personalItem) setErrors({ ...errors, personalItem: '' });
              }} 
              placeholder="Ej. Incluido (45 x 35 x 20 cm)"
              error={errors.personalItem} 
            />
          </FormField>
          <FormField label="Equipaje de Mano (Cabina)" error={errors.carryOn}>
            <Input 
              value={formData.carryOn || ''} 
              onChange={e => {
                setFormData({ ...formData, carryOn: e.target.value });
                if (errors.carryOn) setErrors({ ...errors, carryOn: '' });
              }} 
              placeholder="Ej. 10 kg (55 x 35 x 25 cm) Incluido o No incluido"
              error={errors.carryOn} 
            />
          </FormField>
          <FormField label="Equipaje Documentado (Bodega)" error={errors.checkedBag}>
            <Input 
              value={formData.checkedBag || ''} 
              onChange={e => {
                setFormData({ ...formData, checkedBag: e.target.value });
                if (errors.checkedBag) setErrors({ ...errors, checkedBag: '' });
              }} 
              placeholder="Ej. 23 kg (158 cm lineales) Incluido o No incluido"
              error={errors.checkedBag} 
            />
          </FormField>
          <FormField label="Descripción / Notas Adicionales" error={errors.notes}>
            <Input 
              value={formData.notes || ''} 
              onChange={e => setFormData({ ...formData, notes: e.target.value })} 
              placeholder="Ej. Sujeto a cambios de la aerolínea"
              error={errors.notes} 
            />
          </FormField>
        </>
      );
    case 'commissionAgents':
      return (
        <>
          <FormField label="Nombre Completo / Agencia" error={errors.name}>
            <Input 
              value={formData.name || ''} 
              onChange={e => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }} 
              placeholder="Ej. Asesor Juan o Agencia Viajes Plus"
              error={errors.name}
            />
          </FormField>
          <FormField label="Tipo de Comisionista" error={errors.type}>
            <Select
              value={formData.type || ''}
              onChange={e => {
                setFormData({ ...formData, type: e.target.value });
                if (errors.type) setErrors({ ...errors, type: '' });
              }}
              options={[
                { value: '', label: 'Seleccione un tipo' },
                { value: 'Freelance', label: 'Freelance' },
                { value: 'Agencia Externa', label: 'Agencia Externa' },
                { value: 'Otro', label: 'Otro' }
              ]}
              error={errors.type}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Tipo de Documento" error={errors.docType}>
              <Select
                value={formData.docType || ''}
                onChange={e => {
                  setFormData({ ...formData, docType: e.target.value });
                  if (errors.docType) setErrors({ ...errors, docType: '' });
                }}
                options={[
                  { value: '', label: 'Seleccione' },
                  ...data.config.documentTypes.map((dt: any) => ({ value: dt.name, label: dt.name }))
                ]}
                error={errors.docType}
              />
            </FormField>
            <FormField label="Número Documento" error={errors.docNumber}>
              <Input 
                value={formData.docNumber || ''} 
                onChange={e => {
                  setFormData({ ...formData, docNumber: e.target.value });
                  if (errors.docNumber) setErrors({ ...errors, docNumber: '' });
                }} 
                placeholder="Ej. 1.020..."
                error={errors.docNumber}
              />
            </FormField>
          </div>

          <FormField label="Estado" error={errors.status}>
            <Select
              value={formData.status || 'Activo'}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' }
              ]}
              error={errors.status}
            />
          </FormField>
        </>
      );
    default:
      return null;
  }
}
